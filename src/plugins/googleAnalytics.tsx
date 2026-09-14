import type { ZudokuPlugin } from "zudoku";

const GA_ID = "G-1WFKHGBLJP";

const googleAnalyticsPlugin: ZudokuPlugin = {
  getHead: () => (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />

      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </script>
    </>
  ),
};

export default googleAnalyticsPlugin;
