import { useReducer, type FC } from 'react'

import { CartContext, type CartItem, type CartContextValue } from './cartContext'

type CartAction =
  | { type: 'ADD'; item: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE'; productId: string }
  | { type: 'SET_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR' }

interface CartState {
  items: CartItem[]
}

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((i) => i.productId === action.item.productId)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === action.item.productId ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        }
      }
      return { items: [...state.items, { ...action.item, quantity: 1 }] }
    }
    case 'REMOVE':
      return { items: state.items.filter((i) => i.productId !== action.productId) }
    case 'SET_QUANTITY':
      if (action.quantity <= 0) {
        return { items: state.items.filter((i) => i.productId !== action.productId) }
      }
      return {
        items: state.items.map((i) =>
          i.productId === action.productId ? { ...i, quantity: action.quantity } : i,
        ),
      }
    case 'CLEAR':
      return { items: [] }
  }
}

export const CartProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { items: [] })

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const total = state.items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0)

  const value: CartContextValue = {
    items: state.items,
    itemCount,
    total,
    add: (item) => dispatch({ type: 'ADD', item }),
    remove: (productId) => dispatch({ type: 'REMOVE', productId }),
    setQuantity: (productId, quantity) => dispatch({ type: 'SET_QUANTITY', productId, quantity }),
    clear: () => dispatch({ type: 'CLEAR' }),
    getQuantity: (productId) => state.items.find((i) => i.productId === productId)?.quantity ?? 0,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
