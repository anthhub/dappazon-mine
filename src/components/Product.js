import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Rating from "./Rating";

import close from "../assets/close.svg";

const Product = ({ item, provider, account, dappazon, togglePop }) => {
  const [orders, setOrders] = useState([]);
  const [hasBought, setHasBought] = useState(false);

  const fetchDetails = async () => {
    const events = await dappazon.queryFilter("Buy");

    const orders =
      events.filter((event) => {
        return (
          event.args.buyer?.toLowerCase() === account &&
          event.args.itemId.toString() === item.id.toString()
        );
      }) || [];

    setOrders(
      await Promise.all(
        orders?.map((order) => dappazon.orders(account, order.args.orderId))
      )
    );
  };

  const buyHandler = async () => {
    const signer = await provider.getSigner();

    // Buy item...
    let transaction = await dappazon
      .connect(signer)
      .buy(item.id, { value: item.cost });
    await transaction.wait();

    setHasBought(true);
  };

  useEffect(() => {
    fetchDetails();

    dappazon?.on("Buy", fetchDetails);
    return () => dappazon?.off("Buy", fetchDetails);
  }, [hasBought, account]);

  console.log({ orders });

  return (
    <div className="product">
      <div className="product__details">
        <div className="product__image">
          <img src={item.image} alt="Product" />
        </div>
        <div className="product__overview">
          <h1>{item.name}</h1>

          <Rating value={item.rating} />

          <hr />

          <p>{item.address}</p>

          <h2>{ethers.utils.formatUnits(item.cost.toString(), "ether")} ETH</h2>

          <hr />

          <h2>Overview</h2>

          <p>
            {item.description}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima rem,
            iusto, consectetur inventore quod soluta quos qui assumenda aperiam,
            eveniet doloribus commodi error modi eaque! Iure repudiandae
            temporibus ex? Optio!
          </p>
        </div>

        <div className="product__order">
          <h1>{ethers.utils.formatUnits(item.cost.toString(), "ether")} ETH</h1>

          <p>
            FREE delivery <br />
            <strong>
              {new Date(Date.now() + 345600000).toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </strong>
          </p>

          {item.stock > 0 ? <p>In Stock.</p> : <p>Out of Stock.</p>}

          <button className="product__buy" onClick={buyHandler}>
            Buy Now
          </button>

          <p>
            <small>Ships from</small> Dappazon
          </p>
          <p>
            <small>Sold by</small> Dappazon
          </p>

          {orders?.map((order, index) => (
            <div className="product__bought" key={index}>
              order [{index + 1}]: item bought on <br />
              <strong>
                {new Date(
                  Number(order.time.toString() + "000")
                ).toLocaleDateString(undefined, {
                  weekday: "long",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                })}
              </strong>
            </div>
          ))}
        </div>

        <button onClick={togglePop} className="product__close">
          <img src={close} alt="Close" />
        </button>
      </div>
    </div>
  );
};

export default Product;
