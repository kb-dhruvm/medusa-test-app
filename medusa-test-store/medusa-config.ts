import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

const SHIPPO_API_KEY = "shippo_live_6629626842324443";

module.exports = defineConfig({
  modules: [
    {
      resolve: "./src/modules/brand",
    },
    // {
    //   resolve: "@medusajs/medusa/fulfillment",
    //   options: {
    //     providers: [
    //       {
    //         // if module provider is in a plugin, use `plugin-name/providers/my-fulfillment`
    //         resolve: "./src/modules/shippo-fulfillment",
    //         id: "shippo-fulfillment",
    //         options: {
    //           apiKey: SHIPPO_API_KEY,
    //           // provider options...
    //         },
    //       },
    //       // {
    //       //   resolve: `medusa-fulfillment-shiprocket`,
    //       //   id: "shiprocket",
    //       //   options: {
    //       //     channel_id: process.env.SHIPROCKET_CHANNEL_ID || "6775412", //(required)
    //       //     email: process.env.SHIPROCKET_EMAIL || "dhruv.maniya@kombee.com", //(required)
    //       //     password: process.env.SHIPROCKET_PASSWORD || "Dhruv@123", //(required)
    //       //     token: "", //(required. leave empty)
    //       //     pricing: "calculated", //"flat_rate" or "calculated" (required)
    //       //     length_unit: "cm", //"mm", "cm" or "inches" (required)
    //       //     multiple_items: "split_shipment", //"single_shipment" or "split_shipment"(default) (required)
    //       //     inventory_sync: false, //true or false(default) (required)
    //       //     forward_action: "create_order", //'create_fulfillment' or 'create_order'(default) (required)
    //       //     return_action: "create_order", //'create_fulfillment' or 'create_order'(default) (required)
    //       //   },
    //       // },
    //       // {
    //       //   resolve: `@rsc-labs/medusa-shippo-elements`,
    //       //   id: "shippo",
    //       //   options: {
    //       //     token: `medusa-fulfillment-shippo`,
    //       //     enableUI: true,
    //       //   },
    //       // },
    //     ],
    //   },
    // },
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
      resolve: "@rokmohar/medusa-plugin-meilisearch",
      options: {
        config: {
          host: process.env.MEILISEARCH_HOST ?? "",
          apiKey: process.env.MEILISEARCH_API_KEY ?? "",
        },
        settings: {
          // The key is used as the index name in Meilisearch
          products: {
            // Required: Index type
            type: "products",
            // Optional: Whether the index is enabled. When disabled:
            // - Index won't be created or updated
            // - Documents won't be added or removed
            // - Index won't be included in searches
            // - All operations will be silently skipped
            enabled: true,
            // Optional: Specify which fields to include in the index
            // If not specified, all fields will be included
            fields: [
              "id",
              "title",
              "description",
              "handle",
              "variant_sku",
              "thumbnail",
            ],
            indexSettings: {
              searchableAttributes: ["title", "description", "variant_sku"],
              displayedAttributes: [
                "id",
                "handle",
                "title",
                "description",
                "variant_sku",
                "thumbnail",
              ],
              filterableAttributes: ["id", "handle"],
            },
            primaryKey: "id",
            // Create your own transformer
            /*transformer: (product) => ({
              id: product.id,
              // other attributes...
            }),*/
          },
        },
      },
    },
    // {
    //   resolve: `medusa-fulfillment-shiprocket`,
    //   options: {
    //     channel_id: process.env.SHIPROCKET_CHANNEL_ID, //(required)
    //     email: process.env.SHIPROCKET_EMAIL, //(required)
    //     password: process.env.SHIPROCKET_PASSWORD, //(required)
    //     token: "", //(required. leave empty)
    //     pricing: "calculated", //"flat_rate" or "calculated" (required)
    //     length_unit: "cm", //"mm", "cm" or "inches" (required)
    //     multiple_items: "split_shipment", //"single_shipment" or "split_shipment"(default) (required)
    //     inventory_sync: true, //true or false(default) (required)
    //     forward_action: "create_order", //'create_fulfillment' or 'create_order'(default) (required)
    //     return_action: "create_order", //'create_fulfillment' or 'create_order'(default) (required)
    //   },
    // },
    // {
    //   resolve: `@rsc-labs/medusa-shippo-elements`,
    //   options: {
    //     token: `medusa-fulfillment-shippo`,
    //     enableUI: true,
    //   },
    // },
    // {
    //   resolve: `medusa-fulfillment-shippo`,
    //   options: {
    //     api_key: SHIPPO_API_KEY,
    //     weight_unit_type: "g", // valid values: g, kg, lb, oz
    //     dimension_unit_type: "cm", // valid values: cm, mm, in
    //     webhook_secret: "", // README section on webhooks before using!
    //     webhook_test_mode: false,
    //   },
    // },
    // {
    //   resolve: `medusa-plugin-brightpearl`,
    //   options: {
    //     account: process.env.BRIGHTPEARL_ACCOUNT, // required, the Brightpearl account
    //     channel_id: process.env.BRIGHTPEARL_CHANNEL_ID, // required, channel id to map sales and credits to
    //     backend_url:
    //       process.env.BRIGHTPEARL_BACKEND_URL || "http://localhost:9000", // required, the url where the Medusa server is running, needed for webhooks
    //     event_owner:
    //       process.env.BRIGHTPEARL_EVENT_OWNER ||
    //       "user_01JSGWN0ZDKWECJW1K62M5FDQN", // required, the id of the user who will own goods out events]
    //     warehouse:
    //       process.env.BRIGHTPEARL_WAREHOUSE ||
    //       "sloc_01JSJZBEJHYVCXPTNMBDRV7STC", // required, the warehouse id to allocate orders from
    //     default_status_id: process.env.BRIGHTPEARL_DEFAULT_STATUS_ID || 3, // (default: `3`), the status id to assign new orders with
    //     swap_status_id: process.env.BRIGHTPEARL_SWAP_STATUS_ID || 3, // (default: `3`), the status id to assign new swaps
    //     payment_method_code:
    //       process.env.BRIGHTPEARL_PAYMENT_METHOD_CODE || 1220, // (default: `1220`), the method code to register payments with
    //     sales_account_code: process.env.BRIGHTPEARL_SALES_ACCOUNT_CODE || 4000, // (defaults: `4000`), nominal code to assign line items to
    //     shipping_account_code:
    //       process.env.BRIGHTPEARL_SHIPPING_ACCOUNT_CODE || 4040, // (default: `4040`), nominal code to assign shipping line to
    //     discount_account_code:
    //       process.env.BRIGHTPEARL_DISCOUNT_ACCOUNT_CODE || "CODE_25", // optional, nominal code to use for Discount-type refunds
    //     gift_card_account_code:
    //       process.env.BRIGHTPEARL_GIFT_CARD_ACCOUNT_CODE || 4000, // (default: `4000`), nominal code to use for gift card products and redeems
    //     inventory_sync_cron: process.env.BRIGHTPEARL_INVENTORY_SYNC_CRON, // optional, cron pattern for inventory sync, if left out the job will not be created
    //     cost_price_list: process.env.BRIGHTPEARL_COST_PRICE_LIST || 1, // (default: `1`) the ID of the price list to assign to created claims
    //     base_currency: process.env.BRIGHTPEARL_BASE_CURRENCY || "INR", // (default: `EUR`) the ISO 3 character code of the currency to assign to created claims.
    //   },
    // },
    // {
    //   resolve: `medusa-fulfillment-shiprocket`,
    //   options: {
    //     channel_id: process.env.SHIPROCKET_CHANNEL_ID || "6775412", //(required)
    //     email: process.env.SHIPROCKET_EMAIL || "dhruv.maniya@kombee.com", //(required)
    //     password: process.env.SHIPROCKET_PASSWORD || "Dhruv@123", //(required)
    //     token: "", //(required. leave empty)
    //     pricing: "calculated", //"flat_rate" or "calculated" (required)
    //     length_unit: "cm", //"mm", "cm" or "inches" (required)
    //     multiple_items: "split_shipment", //"single_shipment" or "split_shipment"(default) (required)
    //     inventory_sync: false, //true or false(default) (required)
    //     forward_action: "create_order", //'create_fulfillment' or 'create_order'(default) (required)
    //     return_action: "create_order", //'create_fulfillment' or 'create_order'(default) (required)
    //   },
    // },
  ],
});
