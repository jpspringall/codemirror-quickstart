import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { bracketMatching, defaultHighlightStyle, foldGutter, foldKeymap, indentOnInput, indentUnit, syntaxHighlighting } from '@codemirror/language';
import { highlightSelectionMatches } from '@codemirror/search';
import { Compartment, EditorState } from '@codemirror/state';
import { EditorView, crosshairCursor, drawSelection, highlightActiveLine, highlightActiveLineGutter, highlightSpecialChars, keymap, lineNumbers, rectangularSelection } from '@codemirror/view';

// Theme
import { oneDark } from "@codemirror/theme-one-dark";

// Language
// https://codemirror.net/try/?c=aW1wb3J0IHtiYXNpY1NldHVwLCBFZGl0b3JWaWV3fSBmcm9tICJjb2RlbWlycm9yIgppbXBvcnQge1N0YXRlRWZmZWN0fSBmcm9tICdAY29kZW1pcnJvci9zdGF0ZSc7CmltcG9ydCB7c3FsLCBQb3N0Z3JlU1FMLCBzY2hlbWFDb21wbGV0aW9uU291cmNlfSBmcm9tICJAY29kZW1pcnJvci9sYW5nLXNxbCIKCmxldCBlZGl0b3IgPSBuZXcgRWRpdG9yVmlldyh7CiAgZG9jOiAiU0VMRUNUICogRlJPTSAiLAogIGV4dGVuc2lvbnM6IFsKICAgIGJhc2ljU2V0dXAsIAogICAgc3FsKHsKICAgICAgZGlhbGVjdDogUG9zdGdyZVNRTAogICAgfSkKICBdLAogIHBhcmVudDogZG9jdW1lbnQuYm9keQp9KQoKbGV0IG15U2NoZW1hID0geyAnYWJjLnBlcnNvbic6IFsgJ2lkJywgJ25hbWUnIF0sICdhYmMuYW5pbWFsJzogWyAnaWQnLCAnbmFtZScgXSB9OwplZGl0b3IuZGlzcGF0Y2goewogIGVmZmVjdHM6IFN0YXRlRWZmZWN0LmFwcGVuZENvbmZpZy5vZigKICAgIFBvc3RncmVTUUwubGFuZ3VhZ2UuZGF0YS5vZih7CiAgICAgIGF1dG9jb21wbGV0ZTogc2NoZW1hQ29tcGxldGlvblNvdXJjZSh7c2NoZW1hOiBteVNjaGVtYX0pCiAgICB9KQogICkKfSk7
// https://discuss.codemirror.net/t/custom-language-autocomplete-async/3068
// https://discuss.codemirror.net/t/how-update-extensions-after-creating/4064/4
// https://codemirror.net/examples/config/
// https://discuss.codemirror.net/t/schemacompletionsource-example/5196/10
// https://davidmyers.dev/blog/how-to-build-a-code-editor-with-codemirror-6-and-typescript/introduction
// https://pagehelper.lets-script.com/blog/codemirror6-resize/
// https://www.reddit.com/r/dotnet/comments/nh9gnf/how_to_implement_a_net_core_dbconnectionfactory/
// https://learn.microsoft.com/en-us/dotnet/framework/data/adonet/obtaining-a-dbproviderfactory?source=recommendations
// https://github.com/dotnet/SqlClient/issues/239
import { MSSQL, sql } from "@codemirror/lang-sql";

const _sqlCompartment = new Compartment

function createEditorState(initialContents, options = {}) {
    let extensions = [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        foldGutter(),
        drawSelection(),
        indentUnit.of("    "),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        autocompletion(),
        rectangularSelection(),
        crosshairCursor(),
        highlightActiveLine(),
        highlightSelectionMatches(),
        keymap.of([
            indentWithTab,
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...historyKeymap,
            ...foldKeymap,
            ...completionKeymap,
        ]),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    ];

    extensions.push(_sqlCompartment.of(sql()));

    if (options.oneDark)
        extensions.push(oneDark);

    return EditorState.create({
        doc: initialContents,
        extensions
    });
}

function createEditorView(state, parent) {
    console.log("blah");
    return new EditorView({ state, parent });
}

function createEditorViewFromTextArea(state, textarea) {
    let view = new EditorView({ state, doc: textarea.value })
    textarea.parentNode.insertBefore(view.dom, textarea)
    textarea.style.display = "none"
    if (textarea.form) textarea.form.addEventListener("submit", () => {
        textarea.value = view.state.doc.toString()
    })
    return view
}

function editorFromTextArea(textarea, extensions) {
    let view = new EditorView({ doc: textarea.value, extensions })
    textarea.parentNode.insertBefore(view.dom, textarea)
    textarea.style.display = "none"
    if (textarea.form) textarea.form.addEventListener("submit", () => {
        textarea.value = view.state.doc.toString()
    })
    return view
}

function setAutoComplete(editor, dialectLanguage, autoCompletionList) {
    const dl = MSSQL;
    editor.dispatch({
        effects: _sqlCompartment.reconfigure(sql({
            dialect: dl,
            schema: autoCompletionList
        }))
    })
}

export { createEditorState, createEditorView, createEditorViewFromTextArea, editorFromTextArea, setAutoComplete };

