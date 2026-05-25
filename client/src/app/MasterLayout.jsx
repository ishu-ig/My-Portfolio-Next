"use client";

import Footer from "@/Content/Components/Footer";
import Navbar from "@/Content/Components/Navbar";
import Store from "@/Content/Redux/Store";
import ScrollRestoration from "@/Content/ScrollRestoration";
import { ThemeProvider } from "@/Content/ThemeContext";
import React from "react";
import { Provider } from "react-redux";


export default function MasterLayout({ children }) {
  return (
    <ThemeProvider>
      <Provider store={Store}>
        <Navbar />
        <ScrollRestoration />
        {children}
        <Footer />
      </Provider>
    </ThemeProvider>
  );
}
