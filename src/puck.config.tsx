import { Config } from "@measured/puck";
import { Button } from "./config/blocks/Button";
import { Flex } from "./config/blocks/Flex";
import { Card } from "./config/blocks/Card";
import { Grid } from "./config/blocks/Grid";
import { Heading } from "./config/blocks/Heading";
import { Hero } from "./config/blocks/Hero";
import { Space } from "./config/blocks/Space";
import { Text } from "./config/blocks/Text";
import { Stats } from "./config/blocks/Stats";
import { CodeBlockConfig } from "./config/blocks/CodeBlock";

type Props = {
  HeadingBlock: { title: string; twClasses: string };
};

export const config: Config<Props> = {
  components: {
    HeadingBlock: {
      fields: {
        title: { type: "text" },
        twClasses: { type: "text" }, // Add simple text field to play with Tailind
      },
      defaultProps: {
        title: "Heading",
        twClasses: "",
      },
      render: ({ title, twClasses }) => (
        <div className={twClasses}>
          <h1>{title}</h1>
        </div>
      ),
    },
    Button,
    Card,
    Flex,
    Grid,
    Heading,
    Hero,
    Space,
    Text,
    Stats,
    CodeBlockConfig,
  },
};

export default config;
