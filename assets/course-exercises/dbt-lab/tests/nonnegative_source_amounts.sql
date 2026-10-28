-- NULL is checked separately with not_null on the seed.
select * from {{ ref('orders') }} where amount < 0
