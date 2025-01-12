import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import SocialMediaLinks from "./components/SocialMediaLinks";
import Footer from "./components/Footer";
import "./App.css";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      <SocialMediaLinks />
      <Header />
      <Hero />
      <Outlet/>
      <Footer />
    </div>
  );
}

export default App;
