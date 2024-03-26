# Design of spreadsheet/python engine
- State of spreadsheet is exposed as props on the Grid component
- Evaluator reacts to state changes in the spreadsheet, either `d` or `f` values, and ensures internal consistency.
- Evaluator also updates relevant Python snippets.
- Spreadsheet formulas should be mostly column-equal
  - Exceptions can be made: we could override a certain cell, causing a sort of "hardcoded" if-else statement to appear in the respective for-loop. Similar to conditional formatting.
  - Question: can we use a linter to prevent this from lingering in sheets? Is it worth it to pull in the entirety of VSCode for this?
- Variables are named in header of spreadsheet, where rows down the sheet correspond to a simple for loop.
  - The object being iterated over is probably some zip of the input columns.
  - There might be some cute interface constructions you could do to highlight potential factorings into functions.
  - Some tricky bits with reusing results from more than 1 rows ago: could make this illegal and force user to pull down previous value. But if you're doing something like:
    ```python
    x0, x1 = items[0], items[1]
    for x2 in items[2:]:
      rolling_average.append((x0 + x1 + x2) / 3)
      x0, x1 = x1, x2
    ```
    That looks pretty alright, but more idiomatic would be:
    ```python
    for x0, x1, x2 in zip(items[0:], items[1:], items[2:]):
      rolling_average.append((x0 + x1 + x2) / 3)
    ```
    In which case there is some operation on the "whole" of the column happening (namely a shift).
    