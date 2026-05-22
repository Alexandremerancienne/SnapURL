import { useState } from "react";

import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import UrlShortener from "../components/UrlShortener/UrlShortener";
import ResultBox from "../components/ResultBox/ResultBox";
import Features from "../components/Features/Features";

export default function Home() {
  const [shortUrl, setShortUrl] = useState(null);

  return (
    <>
      <Navbar />
      <Hero />

      <UrlShortener setShortUrl={setShortUrl} />

      <ResultBox shortUrl={shortUrl} />

      <Features />
    </>
  );
}
