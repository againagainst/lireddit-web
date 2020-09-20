import { Box } from "@chakra-ui/core";
import React from "react";

export type WrapperVariant = "small" | "regular";

interface WrapperProps {
  variant?: WrapperVariant;
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = "regular",
}) => {
  return (
    <Box
      marginTop={8}
      mx="auto"
      maxWidth={variant === "regular" ? "800px" : "400px"}
      width="100%"
    >
      {children}
    </Box>
  );
};
