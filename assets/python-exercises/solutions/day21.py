"""Reference implementation. Read only after an attempt; not learner evidence."""


def paid_summary(customers, orders):
    totals = (
        orders.loc[orders["status"].eq("paid")]
        .groupby("customer_id", as_index=False)["amount_cents"]
        .sum()
        .rename(columns={"amount_cents": "paid_total"})
    )
    totals["paid_total"] = totals["paid_total"].astype("Int64")
    result = customers[["customer_id"]].merge(
        totals, on="customer_id", how="left", sort=False, validate="one_to_one"
    )
    result["paid_total"] = result["paid_total"].fillna(0).astype("int64")
    return result
