-- Grain: exactly one row per customer appearing in the paid-order source rows.
select customer_id, sum(amount) as paid_total
from {{ ref('orders') }}
where status = 'paid'
group by customer_id
