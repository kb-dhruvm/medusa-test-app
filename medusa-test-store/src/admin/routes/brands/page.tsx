import { defineRouteConfig } from "@medusajs/admin-sdk";
import { TagSolid } from "@medusajs/icons";
import BrandsPage from "../../components/BrandsPage";

const page = () => {
  return <BrandsPage />;
};

export default page;

export const config = defineRouteConfig({
  label: "Brands",
  icon: TagSolid,
});
