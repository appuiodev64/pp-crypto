import { useEffect } from "react";
export default function Survey() {
  useEffect(() => {
      document.title = "Sondage | Crypto & Blockchain";
    }, []);
  return (
    <iframe
      src="https://docs.google.com/forms/d/e/1FAIpQLScGoHUBCL2wOwJKCd43qHQgGOu3h9D-tiSg6jH-D78TbKZLVA/viewform?usp=header"
      className="w-full h-screen border rounded"
      title="Sondage"
    />
  );
}
