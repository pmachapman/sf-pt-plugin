import papi, { logger } from '@papi/frontend';
import { useData, useDataProvider } from '@papi/frontend/react';
import { useCallback, useState } from 'react';
import type { DoStuffEvent } from 'scripture-forge';
import { Button, useEvent } from 'platform-bible-react';

globalThis.webViewComponent = function ExtensionTemplate2() {
  const [clicks, setClicks] = useState(0);

  useEvent<DoStuffEvent>(
    papi.network.getNetworkEvent('scriptureForge.doStuff'),
    useCallback(({ count }) => setClicks(count), []),
  );

  const extensionVerseDataProvider = useDataProvider('paranextExtensionTemplate.quickVerse');

  const [latestExtensionVerseText] = useData<'paranextExtensionTemplate.quickVerse'>(
    extensionVerseDataProvider,
  ).Verse('latest', 'Loading latest Scripture text from extension template...');

  const [latestQuickVerseText] = useData('quickVerse.quickVerse').Verse(
    'latest',
    'Loading latest Scripture text from extension template...',
  );

  return (
    <>
      <div className="title">
        Scripture Forge <span className="framework">React 2</span>
      </div>
      <div>{latestExtensionVerseText}</div>
      <div>{latestQuickVerseText}</div>
      <div>
        <Button
          onClick={async () => {
            const start = performance.now();
            const result = await papi.commands.sendCommand(
              'scriptureForge.doStuff',
              'Scripture Forge React Component',
            );
            setClicks(clicks + 1);
            logger.info(
              `command:scriptureForge.doStuff '${result.response}' took ${
                performance.now() - start
              } ms`,
            );
          }}
        >
          Hi {clicks}
        </Button>
      </div>
    </>
  );
};
