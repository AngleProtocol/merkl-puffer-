import { createTable } from "dappkit";

export const [CampaignTable, CampaignRow, CampaignColumns] = createTable({
  dailyRewards: {
    name: "Daily rewards",
    size: "minmax(200px,250px)",
    compact: "1fr",
    className: "justify-start",
    main: true,
  },
  restrictions: {
    name: "",
    size: "minmax(170px,1fr)",
    compactSize: "1fr",
    className: "justify-end",
  },
  chain: {
    name: "Chain",
    size: "minmax(30px,150px)",
    compactSize: "minmax(20px,1fr)",
    className: "justify-center",
  },
  timeRemaining: {
    name: "End",
    size: "minmax(100px,200px)",
    compactSize: "minmax(20px,1fr)",
    className: "justify-center",
  },
});
