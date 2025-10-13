import { Box, Stack, Text } from "@mantine/core";

interface ProfileBoxProps {
  username?: string;   // undefined = unknown player
  rating?: number;
}

export function ProfileBox({ username, rating }: ProfileBoxProps) {
  const isUnknown = !username;

  return (
    <Stack align="center" gap="xs">
      {/* Square box */}
      <Box
        style={{
          width: "150px",
          height: "150px",
          backgroundColor: "#D9D9D9",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "110px",
          fontStyle: "italic",
          fontWeight: 700,
          lineHeight: "1",
          fontFamily: "var(--font-montserrat), sans-serif",
        }}
      >
        {isUnknown ? (
          <Text fw={700} fz={40}>
            ?
          </Text>
        ) : (
          <Text fw={700} fz={32}>

          </Text> // placeholder avatar (initial letter)
        )}
      </Box>

      {/* Username + rating */}
      {isUnknown ? (
        <Text c="dimmed">???</Text>
      ) : (
        <Stack gap={0} align="center">
          <Text fw={700}>{username}</Text>
          <Text fz="sm" c="dimmed">
            ({rating})
          </Text>
        </Stack>
      )}
    </Stack>
  );
}
