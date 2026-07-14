import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";

type HoverEffectItem = {
  title: string;
  description: string;
  tag?: string;
  stack?: string[];
  featured?: boolean;
  icon?: ReactNode;
  link?: string;
};

export const HoverEffect = ({
  items,
  className,
}: {
  items: HoverEffectItem[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn("grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6", className)}>
      {items.map((item, idx) => {
        const content = (
          <>
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0 block h-full w-full rounded-3xl border border-hotpink/45 bg-[radial-gradient(circle_at_20%_20%,color-mix(in_oklab,var(--color-hotpink)_18%,transparent),transparent_34%),radial-gradient(circle_at_80%_0%,color-mix(in_oklab,var(--color-teal)_18%,transparent),transparent_36%),radial-gradient(circle_at_50%_100%,color-mix(in_oklab,var(--color-violet)_16%,transparent),transparent_42%)] shadow-[0_22px_70px_-28px_color-mix(in_oklab,var(--color-hotpink)_55%,transparent)]"
                  layoutId="projectHoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.18 } }}
                  exit={{ opacity: 0, transition: { duration: 0.18, delay: 0.08 } }}
                />
              )}
            </AnimatePresence>
            <Card>
              <div className="flex items-center gap-2">
                {item.icon}
                {item.tag && <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors group-hover/card:text-hotpink">{item.tag}</span>}
              </div>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
              {item.stack && item.stack.length > 0 && (
                <div className="mt-6">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-hotpink">Tech stack</div>
                  <div className="flex flex-wrap gap-2">
                    {item.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-border bg-background/75 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors group-hover/card:border-hotpink/40 group-hover/card:bg-hotpink/10 group-hover/card:text-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </>
        );

        return item.link ? (
          <a
            href={item.link}
            key={item.title}
            className="group/card relative block h-full rounded-3xl p-1.5"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {content}
          </a>
        ) : (
          <div
            key={item.title}
            className="group/card relative block h-full rounded-3xl p-1.5"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "glass card-shadow relative z-20 flex h-full min-h-[24rem] w-full flex-col overflow-hidden rounded-2xl border border-border bg-card/88 p-6 transition-all duration-200 group-hover/card:-translate-y-1 group-hover/card:border-hotpink/45 group-hover/card:bg-card md:h-[26rem] md:p-8",
        className,
      )}
    >
      <div className="gradient-cool-bg absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-25 blur-2xl transition-opacity group-hover/card:opacity-45" />
      <div className="gradient-pink-bg absolute -bottom-24 left-8 h-36 w-36 rounded-full opacity-0 blur-2xl transition-opacity group-hover/card:opacity-25" />
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return <h4 className={cn("mt-4 font-display text-2xl font-semibold leading-tight text-foreground md:text-3xl", className)}>{children}</h4>;
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return <p className={cn("mt-3 flex-1 leading-7 text-muted-foreground", className)}>{children}</p>;
};