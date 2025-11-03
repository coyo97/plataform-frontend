import React from 'react';
import { styled } from '@mui/material/styles';
import { GridColumnProps, BreakpointLabel } from './grid.types';
import mq, { breakPoints } from '../../../../config/mq';

type Props = {
  $span: number | Partial<Record<BreakpointLabel, number>>;
  $self?: GridColumnProps['self'];
  as?: keyof JSX.IntrinsicElements;
};

const order: BreakpointLabel[] = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl'];

const Root = styled('div', {
  shouldForwardProp: (prop) => prop !== '$span' && prop !== '$self',
})<Props>(({ $span, $self }) => {
  const css: Record<string, any> = {
    boxSizing: 'border-box',
    minWidth: 0,
  };

  // span base
  if (typeof $span === 'number') {
    css.gridColumn = `span ${$span}`;
  } else {
    const fallback = $span.xxs ?? $span.xs ?? $span.sm ?? $span.md ?? $span.lg ?? $span.xl;
    if (fallback) css.gridColumn = `span ${fallback}`;
    order.forEach((bp) => {
      const val = $span[bp];
      if (val) css[mq(bp, 'min')] = { ...(css[mq(bp, 'min')] || {}), gridColumn: `span ${val}` };
    });
  }

  // justify-self (self) base/responsivo
  if ($self) {
    if (typeof $self === 'string') {
      css.justifySelf = $self;
    } else {
      const sfb = $self.xxs ?? $self.xs ?? $self.sm ?? $self.md ?? $self.lg ?? $self.xl;
      if (sfb) css.justifySelf = sfb;
      order.forEach((bp) => {
        const val = $self[bp] as string | undefined;
        if (val) css[mq(bp, 'min')] = { ...(css[mq(bp, 'min')] || {}), justifySelf: val };
      });
    }
  }

  return css;
});

const GridColumn: React.FC<GridColumnProps> = ({
  span = 1,
  self,
  children,
  className,
  as = 'div',
  style,
}) => {
  return (
    <Root className={className} $span={span} $self={self} as={as} style={style}>
      {children}
    </Root>
  );
};

export default GridColumn;

