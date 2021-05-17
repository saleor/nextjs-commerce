export const checkoutDetailsFragment = /* GraphQL */ `
  fragment checkoutDetails on Checkout {
    id
    token
    created

    totalPrice {
      currency
      gross {
        amount
      }
    }
    subtotalPrice {
      currency
      gross {
        amount
      }
    }

    lines {
      id
      variant {
        id
        name
        sku
        product {
          slug
        }
        media {
          url
        }
        pricing {
          price {
            gross {
              amount
            }
          }
        }
      }
      quantity
      totalPrice {
        currency
        gross {
          amount
        }
      }
    }
  }
`

const getCheckoutQuery = /* GraphQL */ `
  query ($checkoutId: UUID!) {
    checkout(token: $checkoutId) {
      ... on Checkout {
        ...checkoutDetails
      }
    }
  }
  ${checkoutDetailsFragment}
`
export default getCheckoutQuery
