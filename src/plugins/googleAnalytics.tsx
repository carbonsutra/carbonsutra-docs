import type { ZudokuPlugin } from "zudoku";

const GA_ID = "G-1WFKHGBLJP";

const googleAnalyticsPlugin: ZudokuPlugin = {
  getHead: () => (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />

      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `,
        }}
      />
    </>
  ),
};

export default googleAnalyticsPlugin;
