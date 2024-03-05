import {test, assert} from 'vitest';
import {Selection, Direction} from "$lib/Selection.svelte";

test('selection object', () => {
    let selection = new Selection();
    assert.equal(selection.size, 0);

    selection.move(Direction.down, 2);
    selection.move(Direction.right, 3);
    assert.equal(selection.activeCell[0], 2);
    assert.equal(selection.activeCell[1], 3);

    selection.move(Direction.up, 1, true);
    selection.move(Direction.right, 2, true);
    assert.equal(selection.activeCell[0], 1);
    assert.equal(selection.activeCell[1], 5);

    assert.equal(selection.topLeft[0], 1);
    assert.equal(selection.topLeft[1], 3);

    assert.equal(selection.bottomRight[0], 2);
    assert.equal(selection.bottomRight[1], 5);

    // Todo: write test for selection jump (from along topLeft to bottom)
})
