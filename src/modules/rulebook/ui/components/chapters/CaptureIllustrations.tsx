import { CardFaces } from "@/components/cards/CardFaces";
import { CardPlayFigure } from "@/components/cards/CardPlayFigure";
import { ParchmentFigure } from "@/components/surfaces/ParchmentFigure";

import { captureExample } from "../../../application/rulebookContent";
import { cascadeExample, cleanExample, fallExample } from "../../../application/rulebookExamples";

export function captureIllustrations() {
  return {
    "same-rank": (
      <CardPlayFigure
        title="Match the two 4s"
        {...captureExample}
        caption="The 4 of cups captures the 4 of coins. The 7 of clubs and 11 of swords stay on the table."
      />
    ),
    cascade: (
      <ParchmentFigure
        title="Find the chain"
        caption="Play the 2 of cups to match the 2 of coins. Follow the 3, 4 and 5. There is no 6, so the 7 is outside the chain."
      >
        <div className="flex flex-wrap justify-center gap-5">
          <div>
            <p className="mb-2 text-sm font-semibold">You play</p>
            <CardFaces
              label="You play"
              cards={[cascadeExample.played]}
              className="justify-center"
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">Consecutive ranks on the table</p>
            <CardFaces
              label="Consecutive ranks on the table"
              cards={cascadeExample.chain}
              className="justify-center"
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">Outside the chain</p>
            <CardFaces
              label="Outside the chain"
              cards={cascadeExample.outsideChain}
              className="justify-center"
            />
          </div>
        </div>
      </ParchmentFigure>
    ),
    fall: (
      <CardPlayFigure
        title="Catch the last card played"
        {...fallExample}
        caption={`The previous player left the 11 of coins. Match it immediately with your 11 of cups to earn ${fallExample.points} points. The 3 stays.`}
      />
    ),
    clean: (
      <CardPlayFigure
        title="Clear the table"
        {...cleanExample}
        caption={`The 4 of coins is the only card on the table. Capture it with your 4 of cups. With cards still in the deck, clearing the table earns ${cleanExample.points} points.`}
      />
    ),
  };
}
