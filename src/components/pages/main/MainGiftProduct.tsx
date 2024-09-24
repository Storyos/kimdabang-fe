import { getCategoryList } from "@/actions/main/category";
import GiftItemCard from "@/components/Items/GiftItemCard";
import ButtonGroup from "@/components/ui/ButtonGroup";
import MainTitle from "@/components/ui/mainTitle";
import { ItemCardType } from "@/types/items/ItemCard";
import { CategoryType } from "@/types/main/AllCategoryDataType";
import { OptionContextprovider } from "../../../context/OptionContext";

export default async function MainGiftProduct({
  authStatus,
}: {
  authStatus: boolean;
}) {
  const res = await fetch(`${process.env.JSONSERVER_URL}/BestTumblr`, {
    cache: "force-cache",
  });
  const BestTumblr: ItemCardType[] = await res.json();
  const CategoryData: CategoryType[] = await getCategoryList();
  return (
    <section>
      <MainTitle title="스타벅스 기프트" />
      <OptionContextprovider>
        <ButtonGroup CategoryData={CategoryData} />
      </OptionContextprovider>
      <div className="flex overflow-x-auto h-[333.5px] whitespace-nowrap scroll-item gap-4 py-3 mb-8]">
        {BestTumblr.map((item: ItemCardType) => (
          <GiftItemCard
            key={item.productCode}
            item={item}
            authStatus={authStatus}
          />
        ))}
      </div>
    </section>
  );
}
