import Image from "next/image";
import React from "react";
import { Oval } from "react-loader-spinner";

interface props{
  height : number,
  width:number,
  color:string
}
const Spinner = ({height,width,color}: props) => {
  return (
    <>
    {/* style={{ marginLeft: "280px" }} */}
      <div >
        <Oval
          height={height}
          width={width}
          color={color}
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#2a26cc"
          strokeWidth={3}
          strokeWidthSecondary={2}
        />
      </div>
    </>
  );
};

export default Spinner;
