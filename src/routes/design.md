# Design of spreadsheet/python engine
- State of spreadsheet is exposed as props on the Grid component
- Evaluator reacts to state changes in the spreadsheet, either `d` or `f` values, and ensures internal consistency.
- Evaluator also updates relevant Python snippets.
- Spreadsheet formulas should be mostly column-equal
  - Exceptions can be made: we could override a certain cell, causing a sort of "hardcoded" if-else statement to appear in the respective for-loop.
  - Question: can we use a linter to prevent this from lingering in sheets?