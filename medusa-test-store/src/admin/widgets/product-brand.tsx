import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types";
import { clx, Container, Heading, Text, Select } from "@medusajs/ui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { sdk } from "../lib/sdk";

type AdminProductBrand = AdminProduct & {
  brand?: {
    id: string;
    name: string;
  };
};

type Brand = {
  id: string;
  name: string;
};

type BrandsResponse = {
  brands: Brand[];
};

const ProductBrandWidget = ({
  data: product,
}: DetailWidgetProps<AdminProduct>) => {
  const queryClient = useQueryClient();
  const { data: queryResult } = useQuery({
    queryFn: () =>
      sdk.admin.product.retrieve(product.id, {
        fields: "+brand.*",
      }),
    queryKey: [["product", product.id]],
  });

  const { data: brandsData } = useQuery<BrandsResponse>({
    queryFn: () => sdk.client.fetch(`/admin/brands`),
    queryKey: [["brands"]],
  });

  const handleBrandChange = async (value: string) => {
    try {
      await sdk.client.fetch(`/admin/products/${product.id}`, {
        method: "POST",
        body: { brand_id: value },
      });
      await queryClient.invalidateQueries({ queryKey: ["brands"] });
      await queryClient.invalidateQueries({
        queryKey: ["product", product.id],
      });
    } catch (error) {
      console.error("Failed to update product brand:", error);
    }
  };

  const brandName = (queryResult?.product as AdminProductBrand)?.brand?.name;
  const currentBrandId = (queryResult?.product as AdminProductBrand)?.brand?.id;

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">Brand</Heading>
        </div>

        <div className="max-w-80 w-full">
          <Select
            value={currentBrandId || ""}
            onValueChange={handleBrandChange}
          >
            <Select.Trigger>
              <Select.Value placeholder="Select a Brand" />
            </Select.Trigger>
            <Select.Content>
              {brandsData?.brands?.map((brand) => (
                <Select.Item key={brand.id} value={brand.id}>
                  {brand.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>
      </div>
      <div
        className={clx(
          `text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4`
        )}
      >
        <Text size="small" weight="plus" leading="compact">
          Name
        </Text>
        <Text size="small" weight="plus" leading="compact">
          {brandName || "-"}
        </Text>
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.before",
});

export default ProductBrandWidget;
