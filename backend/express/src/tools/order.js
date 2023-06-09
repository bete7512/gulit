import client from '../configuration/apollo.config'
const add_order = `
mutation MyMutation($customer_id: uuid = "", $product_id: uuid = "", $reference_id: uuid = "", $address_id: uuid = "", $quantity: Int = 1) {
	insert_order(objects: {customer_id: $customer_id, product_id: $product_id, reference_id: $reference_id, address_id: $address_id, quantity: $quantity}) {
	  affected_rows
	  returning {
		id
	  }
	}
  }
   
`
const insert_order = async (variables) => {
	const fetchResponse = await client.request(add_order, variables);
	console.log(fetchResponse);
	return fetchResponse.insert_order;
};


export { insert_order }