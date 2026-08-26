"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface Props {
  title: string;
  value: string;
  description: string;
}

export function StatCard({
  title,
  value,
  description,
}: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.25,
      }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-5">
          <section className="flex items-start justify-between">
            <section>
              <p className="text-sm text-muted-foreground">
                {title}
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight">
                {value}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {description}
              </p>
            </section>

            <section className="rounded-full bg-primary/10 p-2">
              <ArrowUpRight className="size-4 text-primary" />
            </section>
          </section>
        </CardContent>
      </Card>
    </motion.section>
  );
}