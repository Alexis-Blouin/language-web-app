import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { pinyin } from "pinyin-pro";
import React, { useState, useRef } from "react";
import toast from "react-simple-toasts";

function WordAttach({ words }) {
  const [listLeft, setListLeft] = React.useState([]);
  const [listRight, setListRight] = React.useState([]);
  const [wordCount, setWordCount] = React.useState(5);
  const [confirmDisabled, setConfirmDisabled] = React.useState(true);
  // Lines elements
  const [connections, setConnections] = useState([]);
  const [selected, setSelected] = useState(null);
  const leftRefs = useRef([]);
  const rightRefs = useRef([]);
  const containerRef = useRef(null);

  const generateRandomWords = React.useCallback(() => {
    if (!words || words.length === 0) return;

    // Clear existing lists and generate new random words
    const newLeft = [];
    const newRight = [];

    for (let i = 0; i < wordCount; i++) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      newLeft.push({
        translation: randomWord.Translation,
        wordTranslationId: randomWord.WordTranslationId,
      });
      newRight.push({
        hanzi: randomWord.Hanzi,
        pinyin: randomWord.Pinyin,
        wordTranslationId: randomWord.WordTranslationId,
      });
    }

    setListLeft(shuffleList(newLeft));
    setListRight(shuffleList(newRight));
    setConnections([]);
    setConfirmDisabled(true);
  }, [words, wordCount]);

  const shuffleList = (list) => {
    const shuffled = [...list];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleBoxClick = (side, index) => {
    if (!selected) {
      setSelected({ side, index });
    } else if (selected.side === side) {
      setSelected({ side, index });
    } else {
      const left = side === "left" ? index : selected.index;
      const right = side === "right" ? index : selected.index;
      // setConnections((prev) => [...prev, { left, right }]);
      setConnections((prevConnections) => [
        ...prevConnections.filter(
          (aConnection) =>
            aConnection.left !== left && aConnection.right !== right,
        ),
        { left, right },
      ]);
      setSelected(null);
      // Since we use states, it won't be updated before the end of the function, so we check for wordCount - 1
      // TODO fix that check. allows to change the fourth one and enable the button
      if (connections.length === wordCount - 1) setConfirmDisabled(false);
    }
  };

  const getLineCoords = (leftIndex, rightIndex) => {
    const container = containerRef.current?.getBoundingClientRect();
    const leftEl = leftRefs.current[leftIndex]?.getBoundingClientRect();
    const rightEl = rightRefs.current[rightIndex]?.getBoundingClientRect();

    if (!container || !leftEl || !rightEl) return null;

    return {
      x1: leftEl.right - container.left,
      y1: leftEl.top + leftEl.height / 2 - container.top,
      x2: rightEl.left - container.left,
      y2: rightEl.top + rightEl.height / 2 - container.top,
    };
  };

  const verify = () => {
    console.log(connections);
    console.log(listLeft);
    console.log(listRight);
    let errorCount = 0;
    connections.forEach((connection) => {
      if (
        listLeft[connection.left].wordTranslationId !==
        listRight[connection.right].wordTranslationId
      ) {
        errorCount++;
      }
    });
    if (errorCount === 0) {
      setConfirmDisabled(true);
      setTimeout(() => {
        setConfirmDisabled(false);
        generateRandomWords();
      }, 2000);
      toast("Correct!", { theme: "success" });
    } else {
      toast(`There are ${errorCount} errors...`);
    }
  };

  React.useEffect(() => {
    generateRandomWords();
  }, [generateRandomWords]);

  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{
        width: "500px",
        mt: 2,
        mr: "auto",
        ml: "auto",
        justifyContent: "center",
      }}
    >
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        Attach the words
      </Typography>
      <Box ref={containerRef} sx={{ position: "relative" }}>
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          {connections.map((conn, i) => {
            const coords = getLineCoords(conn.left, conn.right);
            if (!coords) return null;
            return (
              <line
                key={i}
                x1={coords.x1}
                y1={coords.y1}
                x2={coords.x2}
                y2={coords.y2}
                stroke="blue"
                strokeWidth={2}
              />
            );
          })}
        </svg>

        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          {/* Left column - Translations */}
          <Stack direction="column" spacing={1}>
            {listLeft.map((item, index) => (
              <Box
                key={index}
                ref={(el) => (leftRefs.current[index] = el)}
                onClick={() => handleBoxClick("left", index)}
                sx={{
                  p: 1,
                  border:
                    selected?.side === "left" && selected?.index === index
                      ? "2px solid blue" // ✅ highlight selected
                      : "1px solid #ccc",
                  borderRadius: 1,
                  minWidth: 120,
                  cursor: "pointer",
                }}
              >
                <Typography>{item.translation}</Typography>
              </Box>
            ))}
          </Stack>

          {/* Right column - Hanzi & Pinyin */}
          <Stack direction="column" spacing={1}>
            {listRight.map((item, index) => (
              <Box
                key={index}
                ref={(el) => (rightRefs.current[index] = el)}
                onClick={() => handleBoxClick("right", index)}
                sx={{
                  p: 1,
                  border:
                    selected?.side === "right" && selected?.index === index
                      ? "2px solid blue"
                      : "1px solid #ccc",
                  borderRadius: 1,
                  minWidth: 120,
                  cursor: "pointer",
                }}
              >
                <Typography>{item.hanzi}</Typography>
                {/* <Typography variant="body2" color="text.secondary">
                  {item.pinyin}
                </Typography> */}
              </Box>
            ))}
          </Stack>
        </Stack>
      </Box>
      <Button variant="contained" onClick={verify} disabled={confirmDisabled}>
        Verify
      </Button>
    </Stack>
  );
}

export default WordAttach;

function Item() {
  return <Stack direction="column" spacing={2}></Stack>;
}
