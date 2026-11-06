import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo } from 'motion/react';
import { useRef, useState } from 'react';

/**
 * Research interests as a deck of cards, after cuicui's "Stack" component (MIT licence,
 * itself inspired by React Bits). Drag the top card aside, or press "Next", and it peels off
 * to the back of the deck. Clicking a card opens the paper or source that inspired it.
 * "View all" lays every card out in a grid.
 */

export type Interest = {
  id: string;
  title: string;
  body: string;
  source: { label: string; href: string };
};

const SWIPE_DISTANCE = 110; // px of pointer travel that counts as a peel
const SWIPE_VELOCITY = 500; // px/s flick that counts as a peel
const spring = { type: 'spring', stiffness: 260, damping: 24 } as const;

function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

/** The visual content of one card; shared by the deck and the grid. */
function CardBody({ item }: { item: Interest }) {
  return (
    <>
      <h3 className="display text-[clamp(1.35rem,1.1rem+0.9vw,1.8rem)] leading-tight">{item.title}</h3>
      <p className="mt-4 max-w-[44rem] text-fg-muted">{item.body}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[0.95rem] text-fg">
        {item.source.label}
        <ExternalIcon />
      </span>
    </>
  );
}

function DeckCard({
  item,
  position,
  total,
  leaving,
  onPeel,
  onLeft,
}: {
  item: Interest;
  position: number; // 0 = top of the deck
  total: number;
  leaving: 1 | -1 | null;
  onPeel: (direction: 1 | -1) => void;
  onLeft: () => void;
}) {
  const isTop = position === 0;
  const dragX = useMotionValue(0);
  const tilt = useTransform(dragX, [-200, 200], [-10, 10]);
  const dragged = useRef(false);

  // Cards further back sit lower, smaller and slightly turned, alternating left and right.
  const depth = Math.min(position, 3);
  const resting = {
    x: 0,
    y: depth * 12,
    rotate: depth === 0 ? 0 : (position % 2 ? 1 : -1) * depth * 0.8,
    scale: 1 - depth * 0.03,
    opacity: position > 3 ? 0 : 1,
  };
  const target = leaving ? { x: leaving * 720, y: 30, rotate: leaving * 14, scale: 1, opacity: 0 } : resting;

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > SWIPE_DISTANCE || Math.abs(info.velocity.x) > SWIPE_VELOCITY) {
      onPeel(info.offset.x < 0 ? -1 : 1);
    }
  };

  return (
    <motion.div
      className="deck-slot"
      style={{ zIndex: total - position }}
      initial={false}
      animate={target}
      transition={leaving ? { duration: 0.38, ease: [0.4, 0, 0.6, 1] } : spring}
      onAnimationComplete={() => {
        if (leaving) {
          dragX.set(0);
          onLeft();
        }
      }}
    >
      <motion.div
        className="h-full"
        style={{ x: dragX, rotate: tilt }}
        drag={isTop && !leaving ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.6}
        onDragStart={() => (dragged.current = true)}
        onDragEnd={handleDragEnd}
        whileDrag={{ cursor: 'grabbing' }}
      >
        <a
          href={item.source.href}
          target="_blank"
          rel="noopener"
          draggable={false}
          tabIndex={isTop ? 0 : -1}
          aria-hidden={!isTop}
          className="glow glow-card deck-card"
          onPointerDown={() => (dragged.current = false)}
          onClick={(e) => {
            // A drag that ends on the card must not count as a click.
            if (dragged.current) e.preventDefault();
          }}
        >
          <motion.span
            className="flex h-full flex-col deck-content"
            animate={{ opacity: isTop || leaving ? 1 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <CardBody item={item} />
          </motion.span>
        </a>
      </motion.div>
    </motion.div>
  );
}

export default function InterestDeck({ items }: { items: Interest[] }) {
  const [order, setOrder] = useState(() => items.map((i) => i.id));
  const [leaving, setLeaving] = useState<{ id: string; direction: 1 | -1 } | null>(null);
  const [showAll, setShowAll] = useState(false);
  const byId = new Map(items.map((i) => [i.id, i]));
  // The counter moves on as soon as a card starts peeling away.
  const topIndex = items.findIndex((i) => i.id === (leaving ? order[1] : order[0]));

  const peel = (direction: 1 | -1) => {
    if (!leaving) setLeaving({ id: order[0], direction });
  };
  const sendTopToBack = () => {
    setOrder((o) => [...o.slice(1), o[0]]);
    setLeaving(null);
  };

  return (
    <div>
      <AnimatePresence mode="wait" initial={false}>
        {showAll ? (
          <motion.ul
            key="grid"
            className="interest-grid"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
          >
            {items.map((item) => (
              <li key={item.id}>
                <a href={item.source.href} target="_blank" rel="noopener" className="glow glow-card deck-card h-full">
                  <span className="flex h-full flex-col">
                    <CardBody item={item} />
                  </span>
                </a>
              </li>
            ))}
          </motion.ul>
        ) : (
          <motion.div
            key="deck"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="deck" role="group" aria-roledescription="card stack" aria-label="Research interests">
              {order.map((id, position) => (
                <DeckCard
                  key={id}
                  item={byId.get(id)!}
                  // While the top card peels away, the rest of the deck already moves up one place.
                  position={leaving && id !== leaving.id ? position - 1 : position}
                  total={order.length}
                  leaving={leaving?.id === id ? leaving.direction : null}
                  onPeel={peel}
                  onLeft={sendTopToBack}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {!showAll && (
          <>
            <button type="button" className="glow btn" onClick={() => peel(1)}>
              Next interest
            </button>
            <span className="text-[0.95rem] text-fg-muted tabular-nums" aria-live="polite">
              {topIndex + 1} of {items.length}
            </span>
          </>
        )}
        <button type="button" className="glow btn sm:ml-auto" onClick={() => setShowAll((v) => !v)} aria-expanded={showAll}>
          {showAll ? 'Show as a stack' : 'View all'}
        </button>
      </div>
      {!showAll && (
        <p className="mt-4 text-[0.9rem] text-fg-muted">
          Drag a card aside or press Next to see the following one. Click a card to open the paper behind it.
        </p>
      )}
    </div>
  );
}
