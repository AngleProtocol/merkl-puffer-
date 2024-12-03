import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet, json, useLoaderData } from "@remix-run/react";
import { Button, Group, Hash, Icon, Text, Value } from "dappkit";
import { useMemo, useState } from "react";
import { RewardService } from "src/api/services/reward.service";
import Hero from "src/components/composite/Hero";
import { formatUnits } from "viem";

export async function loader({ params: { address } }: LoaderFunctionArgs) {
  if (!address) throw "";

  //TODO: use a ligther route
  const rewards = await RewardService.getForUser(address);

  return json({ rewards, address });
}

export const meta: MetaFunction<typeof loader> = ({ data, error }) => {
  if (error) return [{ title: error }];
  return [{ title: `${data?.address?.substring(0, 6)}…${data?.address.substring(data?.address.length - 4)} on Merkl` }];
};

export default function Index() {
  const { rewards, address } = useLoaderData<typeof loader>();
  const [_isEditingAddress] = useState(false);

  const { earned, unclaimed } = useMemo(() => {
    return rewards.reduce(
      ({ earned, unclaimed }, chain) => {
        const valueUnclaimed = chain.rewards.reduce((sum, token) => {
          const value =
            Number.parseFloat(formatUnits(token.amount - token.claimed, token.token.decimals)) *
            (token.token.price ?? 0);

          return sum + value;
        }, 0);
        const valueEarned = chain.rewards.reduce((sum, token) => {
          const value = Number.parseFloat(formatUnits(token.claimed, token.token.decimals)) * (token.token.price ?? 0);

          return sum + value;
        }, 0);

        return { earned: earned + valueEarned, unclaimed: unclaimed + valueUnclaimed };
      },
      { earned: 0, unclaimed: 0 },
    );
  }, [rewards]);

  return (
    <Hero
      breadcrumbs={[
        { link: "/", name: "Users" },
        { link: `/users/${address ?? ""}`, name: address ?? "" },
      ]}
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={
        <Group className="w-full gap-xl md:gap-xl*4 items-center">
          {/* TODO: Make it dynamic this */}
          <Group className="flex-col">
            <Value format="$0,0.0a" size={2} className="text-main-12">
              {earned}
            </Value>
            <Text size="xl" bold>
              Total earned
            </Text>
          </Group>
          <Group className="flex-col">
            <Value format="$0,0.0a" size={2} className="text-main-12">
              {unclaimed}
            </Value>
            <Text size={"xl"} bold>
              Claimable
            </Text>
          </Group>
          <Group className="flex-col">
            <Button look="hype" size="lg">
              Claim
            </Button>
          </Group>
        </Group>
      }
      description={
        <Hash size={4} className="text-main-12" format="short" copy>
          {address}
        </Hash>
      }
      tabs={[
        {
          label: (
            <>
              <Icon size="sm" remix="RiGift2Fill" />
              Rewards
            </>
          ),
          link: `/users/${address}`,
        },
        {
          label: (
            <>
              <Icon size="sm" remix="RiDropFill" />
              Liquidity
            </>
          ),
          link: `/users/${address}/liquidity`,
        },
        {
          label: (
            <>
              <Icon size="sm" remix="RiListCheck3" />
              Claims
            </>
          ),
          link: `/users/${address}/claims`,
        },
      ]}>
      <Outlet />
    </Hero>
  );
}
