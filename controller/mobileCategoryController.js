import axios from "axios";
import cheerio from "cheerio";
const mobileCategoryController = async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.flipkart.com/search?q=mobiles"
    );
    const $ = cheerio.load(response.data);
    const products = [];
    console.log(response.data);
    const nameArr = $("._4rR01T");
    const priceArr = $("._1_WHN1");
    console.log(nameArr.length, priceArr.length);
    for (let i = 0; i < nameArr.length; i++) {
      const names = $(nameArr[i]).html();
      const price = $(priceArr[i]).html();

      products.push({
        names,
        price,
      });
    }
    const processedProducts = products.map((product) => {
      return {
        name: product.names,
        price: product.price,
      };
    });
    res.send(200).json({ data: processedProducts });
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.error("Rate limit exceeded");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      await mobileCategoryController();
    } else {
      console.error("Error:", error.message);
    }
    console.error(error);
    res.json(error);
  }
};
export default mobileCategoryController;
