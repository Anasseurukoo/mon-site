export type UserMessage = {
  from: "user";
  kind: "text";
  text: string;
  excludedFromAi?: true;
};

export type AssistantTextMessage = {
  from: "ai";
  kind: "text";
  text: string;
  showPricingBrochure?: boolean;
};

export type AssistantImageMessage = {
  from: "ai";
  kind: "image";
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

export type ChatMessage = UserMessage | AssistantTextMessage | AssistantImageMessage;
