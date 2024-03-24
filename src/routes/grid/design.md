# Design of spreadsheet UI
Basic idea: define state and actions pre-hoc rather than post-hoc

State involved
- [ ] Grid of cells
    - Formula content
    - Calculated content
    - Styling of calculated content
- [ ] Grid of cells contents
- [ ] Currently selected cell or range
- [ ] Mode: navigating, editing, navigating-while-editing
- [ ] Mouse cursor position? 

Keyboard events: basic navigating
- [x] Arrow keys to navigate. "Bump" on top and front.
- [x] Arrow keys to navigate. Create more rows/columns when "running off"
- [x] Enter to start editing a cell
- [x] F2 to start editing a cell
- [x] Tab to jump to cell on right
- [x] Shift+ Tab to jump to cell on left
- [x] Shift to select a range. 
- [x] Ctrl to jump to some "edge"
- [x] Shift+space to select entire row
- [x] Ctrl+space to select entire column

Keyboard events: manipulating cells while navigating
- [x] Delete/Backspace to clear a cell or range
- [ ] If range is entire rows/columns, delete columns/rows from sheet. Move selection to top and left (single cell) in that case
- [ ] Ctrl+C, Ctrl+X, Ctrl+V in the usual way
- [ ] Ctrl+Z to undo, Ctrl+Shift+Z to redo
    - How to implement?

Keyboard events: editing
- [ ] Default action: system on input box
- [x] Escape to exit edit mode and discard changes
- [x] Enter to keep changes and start editing cell below
- [x] Shift+enter to keep changes and start editing cell above
- [x] Tab to keep changes and start editing cell to the right
- [x] Shift+Tab to keep changes and start editing cell to the left
- [x] F2 to change to navigating-while-editing mode

Keyboard events: navigating-while-editing
- [ ] Default action: basic navigating (while inserting a reference to the selection at the edit cursor)
- [ ] Fallback: editing
- [x] F2 to change to editing mode (clear selection)

Mouse events: navigating
- [x] Double-click to start editing
- [x] Click in gutter to select column or row
- [ ] Double click in header to rename
- [ ] Click-and-drag in gutter-betweens to resize column or row
- [ ] Double-click in gutter-betweens to resize column or row to fit
    - This is probably a bit difficult
- [x] Click in non-selected cell to select that cell
- [x] Click in selected cell to start editing that cell
- [ ] Click and drag to select a range
    - How to implement?
- [ ] Right click -> context menu to delete rows/columns, copy, or clear for clicked-on cell

Mouse events: editing
- [x] If event in currently editing cell: system default
- [x] If event outside currently editing cell: navigating
- [ ] Inserting a reference to the selection at the edit cursor in navigate-while-edit
- [x] Double click outside currently editing cell: exit edit mode, discard changes, and select clicked-on cell

TODO:
- [ ] Describe range editing semantics -> replace all with new input
- [ ] Resizing rows/columns using keyboard
- [ ] Formatting-related shenanigans
- [ ] Rearranging columns?
