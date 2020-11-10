#!/usr/bin/env bash

# this file is purely to run the debugger.

echo Running dev script!
REACT_DEBUGGER="unset ELECTRON_RUN_AS_NODE && open -g 'rndebugger://set-debugger-loc?port=19001' ||" npm run expoStart