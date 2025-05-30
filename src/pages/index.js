import Head from "next/head";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  return (
    <>
      <Head>
        <title>GPT Chatbot</title>
      </Head>
      <ChatInterface />
    </>
  );
}
