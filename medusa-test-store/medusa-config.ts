import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

module.exports = defineConfig({
  modules: [
    {
      resolve: "./src/modules/brand",
    },
  ],
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  plugins: [
    {
      resolve: `medusa-fulfillment-shiprocket`,
      options: {
        channel_id: process.env.SHIPROCKET_CHANNEL_ID, //(required)
        email: process.env.SHIPROCKET_EMAIL, //(required)
        password: process.env.SHIPROCKET_PASSWORD, //(required)
        token: "", //(required. leave empty)
        pricing: "calculated", //"flat_rate" or "calculated" (required)
        length_unit: "cm", //"mm", "cm" or "inches" (required)
        multiple_items: "split_shipment", //"single_shipment" or "split_shipment"(default) (required)
        inventory_sync: false, //true or false(default) (required)
        forward_action: "create_order", //'create_fulfillment' or 'create_order'(default) (required)
        return_action: "create_order", //'create_fulfillment' or 'create_order'(default) (required)
      },
    },
    {
      resolve: `medusa-plugin-brightpearl`,
      options: {
        account: process.env.BRIGHTPEARL_ACCOUNT, // required, the Brightpearl account
        channel_id: process.env.BRIGHTPEARL_CHANNEL_ID, // required, channel id to map sales and credits to
        backend_url: process.env.BRIGHTPEARL_BACKEND_URL, // required, the url where the Medusa server is running, needed for webhooks
        event_owner: process.env.BRIGHTPEARL_EVENT_OWNER, // required, the id of the user who will own goods out events]
        warehouse: process.env.BRIGHTPEARL_WAREHOUSE, // required, the warehouse id to allocate orders from
        default_status_id: process.env.BRIGHTPEARL_DEFAULT_STATUS_ID, // (default: `3`), the status id to assign new orders with
        swap_status_id: process.env.BRIGHTPEARL_SWAP_STATUS_ID, // (default: `3`), the status id to assign new swaps
        claim_status_id: process.env.BRIGHTPEARL_CLAIM_STATUS_ID, // (default: `3`), the status id to assign new claims
        payment_method_code: process.env.BRIGHTPEARL_PAYMENT_METHOD_CODE, // (default: `1220`), the method code to register payments with
        sales_account_code: process.env.BRIGHTPEARL_SALES_ACCOUNT_CODE, // (defaults: `4000`), nominal code to assign line items to
        shipping_account_code: process.env.BRIGHTPEARL_SHIPPING_ACCOUNT_CODE, // (default: `4040`), nominal code to assign shipping line to
        discount_account_code: process.env.BRIGHTPEARL_DISCOUNT_ACCOUNT_CODE, // optional, nominal code to use for Discount-type refunds
        gift_card_account_code: process.env.BRIGHTPEARL_GIFT_CARD_ACCOUNT_CODE, // (default: `4000`), nominal code to use for gift card products and redeems
        inventory_sync_cron: process.env.BRIGHTPEARL_INVENTORY_SYNC_CRON, // optional, cron pattern for inventory sync, if left out the job will not be created
        cost_price_list: process.env.BRIGHTPEARL_COST_PRICE_LIST, // (default: `1`) the ID of the price list to assign to created claims
        base_currency: process.env.BRIGHTPEARL_BASE_CURRENCY, // (default: `EUR`) the ISO 3 character code of the currency to assign to created claims.
      },
    },
  ],
});
