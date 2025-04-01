import Image from "next/image";
import HomepageButton from "./components/HomepageButton";

export default function Home() {
  return (
    <div className="items-center object-cover rounded-lg w-full h-64 flex flex-col mt-05">
      <Image className="mt-7" src="/ndw-logo.png" alt="NDW Logo" width={256} height={256}>
      </Image>
      <HomepageButton/>
    </div>
  );
}
