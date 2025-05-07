import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils";
import {
  CalculatedShippingOptionPrice,
  CalculateShippingOptionPriceDTO,
  CreateFulfillmentResult,
  FulfillmentOption,
  Logger,
} from "@medusajs/framework/types";

type InjectedDependencies = {
  logger: Logger;
};

type Options = {
  apiKey: string;
};

class shippoFulfillmentProviderService extends AbstractFulfillmentProviderService {
  static identifier = "shippo-fulfillment";
  // other properties...
  protected logger_: Logger;
  protected options_: Options;
  // assuming you're initializing a client
  protected client;

  constructor({ logger }: InjectedDependencies, options: Options) {
    super();

    this.logger_ = logger;
    this.options_ = options;

    // TODO initialize your client
  }

  async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
    // assuming you have a client
    // const services = await this.client.getServices();

    return [
      {
        id: "shippo_usps_priority",
        name: "USPS Priority (via Shippo)",
        service_code: "usps_priority",
      },
      {
        id: "shippo_fedex_ground",
        name: "FedEx Ground (via Shippo)",
        service_code: "fedex_ground",
      },
    ];
  }

  async validateFulfillmentData(
    optionData: any,
    data: any,
    context: any
  ): Promise<any> {
    // assuming your client retrieves an ID from the
    // third-party service
    const externalId = await this.client.getId();

    return {
      ...data,
      externalId,
    };
  }

  async validateOption(data: any): Promise<boolean> {
    return data.external_id !== undefined;
  }

  async canCalculate(data: any): Promise<boolean> {
    // assuming you have a client
    return await this.client.hasRates(data.id);
  }

  async calculatePrice(
    optionData: CalculateShippingOptionPriceDTO["optionData"],
    data: CalculateShippingOptionPriceDTO["data"],
    context: CalculateShippingOptionPriceDTO["context"]
  ): Promise<CalculatedShippingOptionPrice> {
    // assuming the client can calculate the price using
    // the third-party service
    const price = await this.client.calculate(data);
    return {
      calculated_amount: price,
      // Update this boolean value based on your logic
      is_calculated_price_tax_inclusive: true,
    };
  }

  async createFulfillment(
    data: any,
    items: any,
    order: any,
    fulfillment: any
  ): Promise<CreateFulfillmentResult> {
    // assuming the client creates a fulfillment
    // in the third-party service
    const externalData = await this.client.create(fulfillment, items);

    return {
      data: {
        ...((fulfillment.data as object) || {}),
        ...externalData,
      },
    };
  }

  async cancelFulfillment(data: Record<string, unknown>): Promise<any> {
    // assuming the client cancels a fulfillment
    // in the third-party service
    const { external_id } = data as {
      external_id: string;
    };
    await this.client.cancel(external_id);
  }

  async getFulfillmentDocuments(data: any): Promise<never[]> {
    // assuming the client retrieves documents
    // from a third-party service
    return await this.client.documents(data);
  }

  async createReturnFulfillment(
    fulfillment: Record<string, unknown>
  ): Promise<CreateFulfillmentResult> {
    // assuming the client creates a fulfillment for a return
    // in the third-party service
    const externalData = await this.client.createReturn(fulfillment);

    return {
      data: {
        ...((fulfillment.data as object) || {}),
        ...externalData,
      },
    };
  }

  async getReturnDocuments(data: any): Promise<never[]> {
    // assuming the client retrieves documents
    // from a third-party service
    return await this.client.documents(data);
  }

  async getShipmentDocuments(data: any): Promise<never[]> {
    // assuming the client retrieves documents
    // from a third-party service
    return await this.client.documents(data);
  }

  async retrieveDocuments(
    fulfillmentData: any,
    documentType: any
  ): Promise<void> {
    // assuming the client retrieves documents
    // from a third-party service
    return await this.client.documents(fulfillmentData, documentType);
  }
}

export default shippoFulfillmentProviderService;
