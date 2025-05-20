// Eliminar todos los tipos de TypeScript y convertir a comentarios JSDoc si se desea documentación
// Este archivo ya no es necesario en un proyecto JS puro, pero si quieres mantener la documentación:

/**
 * @typedef {Object} ProductCategory
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string=} parentId
 */

/**
 * @typedef {Object} ProductReview
 * @property {string} id
 * @property {string} userId
 * @property {string} userName
 * @property {number} rating
 * @property {string} comment
 * @property {string} date
 */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string} description
 * @property {number} price
 * @property {number=} salePrice
 * @property {string[]} images
 * @property {string} categoryId
 * @property {number} stock
 * @property {boolean} featured
 * @property {Object.<string, string>} specifications
 * @property {ProductReview[]} reviews
 * @property {number} averageRating
 */

/**
 * @typedef {'received' | 'processing' | 'shipped' | 'delivered'} OrderStatus
 * @typedef {'yape' | 'plin' | 'visa' | 'mastercard' | 'cashOnDelivery'} PaymentMethod
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} userId
 * @property {Array<{productId: string, productName: string, quantity: number, price: number}>} items
 * @property {OrderStatus} status
 * @property {number} total
 * @property {number} subtotal
 * @property {number} tax
 * @property {string} shippingAddress
 * @property {PaymentMethod} paymentMethod
 * @property {string} createdAt
 */

// Este archivo solo contiene definiciones de tipos para referencia JSDoc en JS.