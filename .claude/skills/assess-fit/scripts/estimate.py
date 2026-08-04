#!/usr/bin/env python3
"""Compound the funnel estimates for assess-fit and check them against base rates.

The arithmetic is trivial. The point is that it is not done in prose: stage
probabilities are conditional, so the offer figure is a product of all three and
has to come out below every stage above it. Done by hand, a 12% first interview
quietly becomes a 9% offer and nobody notices.

The second job is the outside view. Every estimate is printed next to the
published base rate for its route, so an estimate that has drifted has to be
argued for rather than waved through.

Usage:
    estimate.py --route cold --p-first 0.12 --p-final 0.45 --p-offer 0.35 \\
                --band-low 70000 --band-high 90000 --position 0.35 0.55

Stdlib only, no network. See METHOD.md for where the base rates come from.
"""

import argparse
import sys

# Published ranges for (P(first-stage interview), P(offer)), by route in.
# Sources and confidence are tabulated in METHOD.md - read that before trusting
# a number here. The cold figures are the well-evidenced ones; the rest are
# derived from multipliers and are correspondingly softer.
ROUTES = {
    "cold": {
        "label": "cold application",
        "first": (0.03, 0.13),
        "offer": (0.001, 0.02),
        "note": (
            "CareerPlug 2025 puts application to interview at 3% across 10M+\n"
            "  applications; datasets counting a recruiter screen rather than an\n"
            "  interview run to 13%. Cold application to offer lands at 0.1-2%."
        ),
    },
    "approached": {
        "label": "approached by a recruiter or inbound",
        "first": (0.15, 0.45),
        "offer": (0.01, 0.06),
        "note": (
            "No clean published benchmark. Interpolated between cold and referral:\n"
            "  an approach clears the screening stage a referral clears, but carries\n"
            "  none of the vouching that follows. Low confidence - widen the range."
        ),
    },
    "referral": {
        "label": "internal referral",
        "first": (0.35, 0.60),
        "offer": (0.02, 0.10),
        "note": (
            "57% of referrals reach a screen against 13% cold, and referred\n"
            "  candidates are hired around 4x more often. The offer band is derived\n"
            "  from that multiplier rather than measured directly."
        ),
    },
    "internal": {
        "label": "internal candidate or known to the hiring manager",
        "first": (0.40, 0.75),
        "offer": (0.05, 0.25),
        "note": (
            "Extrapolated past the referral figures; no reliable public benchmark.\n"
            "  Use it as a prior, not as evidence, and say in the report that it is one."
        ),
    },
}


def probability(text):
    value = float(text)
    if not 0.0 < value <= 1.0:
        raise argparse.ArgumentTypeError(
            f"{text} is not a probability - use a decimal in (0, 1], e.g. 0.12"
        )
    return value


def pct(value):
    """Two significant figures below 10%, one decimal above. Anything finer is a
    claim to precision the base rates cannot support."""
    if value < 0.01:
        return f"{value * 100:.2f}%"
    return f"{value * 100:.1f}%"


def money(value):
    return f"£{value:,.0f}"


def check(value, low, high):
    """Compare one estimate against its base-rate band. Outside is allowed; it
    just has to be argued for."""
    if value < low:
        return "below band - is the case really this weak?"
    if value > high:
        return "ABOVE band - name what is 10x here, or revise"
    return "inside band"


def main():
    parser = argparse.ArgumentParser(
        description="Compound assess-fit stage estimates and check them against base rates.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--route",
        choices=sorted(ROUTES),
        default="cold",
        help="how the application reaches the company (default: cold)",
    )
    parser.add_argument(
        "--p-first",
        type=probability,
        required=True,
        help="P(first-stage interview | applied)",
    )
    parser.add_argument(
        "--p-final",
        type=probability,
        required=True,
        help="P(final-stage interview | first-stage interview)",
    )
    parser.add_argument(
        "--p-offer",
        type=probability,
        required=True,
        help="P(offer | final-stage interview)",
    )
    parser.add_argument("--band-low", type=float, help="bottom of the salary band")
    parser.add_argument("--band-high", type=float, help="top of the salary band")
    parser.add_argument(
        "--position",
        type=float,
        nargs="+",
        metavar="P",
        help="where in the band, 0-1. One value for a point, two for a range.",
    )
    args = parser.parse_args()

    route = ROUTES[args.route]

    # Validate the band before anything is printed - an error arriving after a
    # table of numbers reads as though the numbers stood.
    positions = []
    if args.band_low is not None or args.band_high is not None:
        if args.band_low is None or args.band_high is None:
            parser.error("--band-low and --band-high go together")
        if args.band_low > args.band_high:
            parser.error("--band-low is above --band-high")
        positions = args.position or [0.5]
        if len(positions) > 2:
            parser.error("--position takes one value or two, not more")
        if any(not 0.0 <= p <= 1.0 for p in positions):
            parser.error("--position values must be between 0 and 1")
    elif args.position:
        parser.error("--position needs --band-low and --band-high")

    cumulative_first = args.p_first
    cumulative_final = cumulative_first * args.p_final
    cumulative_offer = cumulative_final * args.p_offer

    print(f"\nRoute: {route['label']}\n")
    print(f"{'Stage':<26}{'Conditional':>14}{'Cumulative':>14}")
    print("-" * 54)
    print(f"{'First-stage interview':<26}{pct(args.p_first):>14}{pct(cumulative_first):>14}")
    print(f"{'Final-stage interview':<26}{pct(args.p_final):>14}{pct(cumulative_final):>14}")
    print(f"{'Offer':<26}{pct(args.p_offer):>14}{pct(cumulative_offer):>14}")

    if positions:
        span = args.band_high - args.band_low
        placements = sorted(args.band_low + p * span for p in positions)
        value_low = placements[0]
        value_high = placements[-1]

        print()
        band = f"band {money(args.band_low)}-{money(args.band_high)}"
        if value_low == value_high:
            print(f"{'Offer value if it lands':<26}{money(value_low):>28}   ({band})")
        else:
            placed = f"{money(value_low)} - {money(value_high)}"
            print(f"{'Offer value if it lands':<26}{placed:>28}   ({band})")

        midpoint = (value_low + value_high) / 2
        print(f"{'Expected value':<26}{money(cumulative_offer * midpoint):>28}")
        print(
            "  Expected value ranks applications against each other. It is not a\n"
            "  prediction about this one - say so when reporting it."
        )

    print(f"\nOutside view ({route['label']})\n")
    for name, estimate, (low, high) in (
        ("First-stage interview", cumulative_first, route["first"]),
        ("Offer", cumulative_offer, route["offer"]),
    ):
        band = f"{pct(low)} - {pct(high)}"
        print(f"  {name:<24}{band:<18}{check(estimate, low, high)}")
    print(f"\n  {route['note']}\n")

    return 0


if __name__ == "__main__":
    sys.exit(main())
