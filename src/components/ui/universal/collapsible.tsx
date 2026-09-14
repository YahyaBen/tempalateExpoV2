import { Collapsible as ExpoCollapsible } from '@expo/ui';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';

import { useThemeTokens } from '@/hooks/use-theme';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const theme = useThemeTokens();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ExpoCollapsible
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      label={title}
      labelStyle={{
        ...theme.typography.control.collapsibleLabel,
        color: theme.components.collapsible.color.label,
      }}>
      {children}
    </ExpoCollapsible>
  );
}
