/*

sudo -s
cd /home/wgmlgz/Downloads/emsdk && source emsdk_env.sh && cd /home/wgmlgz/code/School/Forest/TreeLib/
emcc -o ../Frontend/build.js TreeLibExport.cpp -O3 -s WASM=1 -s NO_EXIT_RUNTIME=1  -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall']" --preload-file file.txt   -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' -std=c++11
*/

#include "TreeLib.h"

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

#ifdef __cplusplus
extern "C" {
#endif



#ifdef __EMSCRIPTEN__
    EMSCRIPTEN_KEEPALIVE
#endif
        void EXPORT_createTestTree(int tree_size) {
        createTestTree(tree_size);
    }

#ifdef __EMSCRIPTEN__
    EMSCRIPTEN_KEEPALIVE
#endif
        void EXPORT_outputTestTree() {
        outputTestTree();
    }

#ifdef __EMSCRIPTEN__
    EMSCRIPTEN_KEEPALIVE
#endif
        int EXPORT_readChar() {
        return readChar();
    }
#ifdef __EMSCRIPTEN__
    EMSCRIPTEN_KEEPALIVE
#endif
        void EXPORT_resetRead() {
        resetRead();
    }

#ifdef __cplusplus
}
#endif
