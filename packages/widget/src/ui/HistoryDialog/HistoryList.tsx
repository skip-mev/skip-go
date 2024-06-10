import {
  ArrowPathIcon,
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  EyeIcon,
  TrashIcon,
  XCircleIcon,
} from '@heroicons/react/20/solid';
import * as Accordion from '@radix-ui/react-accordion';
import {
  ComponentPropsWithoutRef,
  forwardRef,
  Fragment,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import * as DescriptionList from './DescriptionList';
import { RenderDate } from './RenderDate';
import { txHistory, TxHistoryItem } from '../../store/tx-history';
import { useFinalityTimeEstimate } from '../../hooks/useFinalityTimeEstimate';
import { useBroadcastedTxsStatus } from '../../hooks/use-broadcasted-txs';
import { cn } from '../../utils/ui';
import { ChainSymbol } from '../ChainSymbol';
import { AssetValue } from '../AssetValue';
import { disclosure } from '../../store/disclosures';
import { useSwapWidgetUIStore } from '../../store/swap-widget';
import { css } from '@emotion/css';

type RootProps = Omit<Accordion.AccordionSingleProps, 'type'>;

export const Root = forwardRef<HTMLDivElement, RootProps>(function Root(
  props,
  ref
) {
  return (
    <Accordion.Root
      className={cn('flex flex-col items-stretch space-y-2 py-2')}
      collapsible
      type="single"
      {...props}
      ref={ref}
    />
  );
});

const iconMap = {
  success: CheckCircleIcon,
  pending: ArrowPathIcon,
  failed: XCircleIcon,
};

type StatusIconProps = ComponentPropsWithoutRef<'svg'> & {
  status: TxHistoryItem['status'];
};

export const StatusIcon = ({ status, ...props }: StatusIconProps) => {
  const Icon = useMemo(() => iconMap[status], [status]);
  return <Icon {...props} />;
};

type ItemProps = Omit<Accordion.AccordionItemProps, 'value'> & {
  id: string;
  data: TxHistoryItem;
};

export const Item = forwardRef<HTMLDivElement, ItemProps>(function Item(
  props,
  ref
) {
  const { id, data, className, ...rest } = props;
  const headingRef = useRef<HTMLHeadingElement>(null);

  const estimatedFinalityTime = useFinalityTimeEstimate(data.route);
  const {
    data: txsStatus,
    isLoading,
    errorUpdateCount,
  } = useBroadcastedTxsStatus({
    txsRequired: data.route.txsRequired,
    txs: data.txStatus.map((item) => ({
      chainID: item.chainId,
      txHash: item.txHash,
    })),
    enabled: !(data.status === 'success' || data.status === 'failed'),
  });
  useEffect(() => {
    if (errorUpdateCount > 4) {
      txHistory.remove(id);
    }
    if (txsStatus?.isSettled) {
      if (txsStatus.isSuccess) {
        txHistory.success(id);
      }
      if (!txsStatus.isSuccess) {
        txHistory.fail(id);
      }
    }
  }, [errorUpdateCount, id, txsStatus]);

  return (
    <Accordion.Item
      className={cn(
        'p-1',
        'rounded-lg border border-neutral-200 transition-all',
        'data-[state=open]:shadow-md',
        'data-[state=open]:-mx-1 data-[state=open]:p-2',
        className
      )}
      value={id}
      {...rest}
      ref={ref}
    >
      <Accordion.Header
        className={cn(
          'relative flex flex-col items-stretch space-y-2',
          'rounded-md p-2 transition-colors hover:bg-neutral-100'
        )}
        ref={headingRef}
      >
        <div className="flex items-center space-x-4 text-start">
          <time className="whitespace-nowrap text-center text-sm uppercase tabular-nums opacity-60">
            <RenderDate date={data.timestamp} />
          </time>
          <div className="flex-grow">
            <div className="flex items-center text-sm font-medium">
              <ChainSymbol chainId={data.route.sourceAssetChainID} />
              <ArrowRightIcon className="mx-1 h-4 w-4" />
              <ChainSymbol chainId={data.route.destAssetChainID} />
            </div>
            <div className="flex items-center text-sm opacity-60">
              <AssetValue
                chainId={data.route.sourceAssetChainID}
                denom={data.route.sourceAssetDenom}
                value={data.route.amountIn}
              />
              <ArrowRightIcon className="mx-1 h-3 w-3" />
              <AssetValue
                chainId={data.route.destAssetChainID}
                denom={data.route.destAssetDenom}
                value={data.route.amountOut}
              />
            </div>
          </div>
          <div
            className={cn('flex items-center space-x-1 text-sm', {
              'text-green-600': data.status === 'success',
              'text-neutral-600': data.status === 'pending',
              'text-red-600': data.status === 'failed',
            })}
          >
            {!isLoading && <span className="capitalize">{data.status}</span>}
            <StatusIcon
              status={data.status}
              className={cn('h-4 w-4', !txsStatus?.isSettled && 'animate-spin')}
            />
          </div>
        </div>

        <Accordion.Trigger
          className={cn(
            'group flex items-center justify-center self-center text-xs text-black/60 outline-none',
            'HistoryListTrigger hover:underline',
            "before:absolute before:inset-0 before:content-['']"
          )}
          onClick={() => {
            if (!headingRef.current) return;
            const rect = headingRef.current.getBoundingClientRect();
            const top = rect.top + window.scrollY;
            const offset = rect.height / 2;
            const y = top - offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }}
        >
          <span className="HistoryListTriggerText" />
          <ChevronDownIcon
            className={cn(
              'h-4 w-4',
              'transition-transform group-data-[state=open]:rotate-180'
            )}
            aria-hidden
          />
        </Accordion.Trigger>
      </Accordion.Header>

      <Accordion.Content
        className={cn(
          'space-y-2 overflow-hidden',
          'data-[state=open]:animate-accordion-open',
          'data-[state=closed]:animate-accordion-closed'
        )}
      >
        <DescriptionList.Root className="pt-2">
          <DescriptionList.Row>
            <DescriptionList.Dt>Chain Route</DescriptionList.Dt>
            <DescriptionList.Dd className="flex flex-wrap items-center">
              {data.route.chainIDs.map((chainId, i) => (
                <Fragment key={i}>
                  {i > 0 && <ArrowRightIcon className="mx-1 h-4 w-4" />}
                  <ChainSymbol chainId={chainId} />
                </Fragment>
              ))}
            </DescriptionList.Dd>
          </DescriptionList.Row>
          {data.txStatus.map((stat, i) => (
            <DescriptionList.Row key={i}>
              <DescriptionList.Dt className="tabular-nums">
                Transaction {i + 1}
              </DescriptionList.Dt>
              <DescriptionList.Dd className="space-y-1">
                <a
                  href={stat.explorerLink}
                  target="_blank"
                  className="flex items-center space-x-px hover:underline"
                >
                  <span className="max-w-[24ch] truncate tabular-nums">
                    {stat.txHash}
                  </span>
                  <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                </a>
                {stat.axelarscanLink ? (
                  <a
                    href={stat.axelarscanLink}
                    target="_blank"
                    className="flex items-center space-x-px hover:underline"
                  >
                    <span className="max-w-[24ch] truncate tabular-nums">
                      Axelarscan
                    </span>
                    <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                  </a>
                ) : null}
              </DescriptionList.Dd>
            </DescriptionList.Row>
          ))}
          <DescriptionList.Row>
            <DescriptionList.Dt>Completion Time</DescriptionList.Dt>
            <DescriptionList.Dd>
              {estimatedFinalityTime === ''
                ? '2 minutes'
                : estimatedFinalityTime}
            </DescriptionList.Dd>
          </DescriptionList.Row>
        </DescriptionList.Root>
        <div className="flex space-x-1">
          <button
            className={cn(
              'rounded-md border bg-neutral-100 px-2 py-1 text-xs transition-colors hover:bg-neutral-200',
              'flex flex-grow items-center justify-center space-x-1'
            )}
            onClick={() => {
              disclosure.openJson({ title: 'Tx History JSON', data });
            }}
          >
            <EyeIcon className="h-3 w-3" />
            <span>View Raw Route</span>
          </button>
          <button
            className={cn(
              'rounded-md px-2 py-1 text-xs transition-colors',
              'flex items-center justify-center space-x-1',
              `opacity-80 hover:opacity-90`,
              css`
                color: ${useSwapWidgetUIStore.getState().colors.primary};
                background-color: ${useSwapWidgetUIStore.getState().colors
                  .primary};
              `
            )}
            onClick={() => txHistory.remove(id)}
          >
            <TrashIcon className="h-3 w-3" />
          </button>
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
});
