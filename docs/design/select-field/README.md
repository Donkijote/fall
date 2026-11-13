# Select field

The trigger borrows the [TextInput frame](../text-input/README.md) and adds a
brass chevron that turns when the menu opens. The menu uses the popover
palette with a nine-sliced brass artwork frame and diagonal corners, and the
[ChoiceButton wax artwork](../choice-button/README.md)
for the selected row. An unselected target previews a muted wax surface on
hover or keyboard highlight. The selected surface lifts slightly and carries
a small recessed wax impression.

GSAP turns the chevron, fades in the menu, and animates the wax lift. Reduced motion applies both
states immediately. Base UI continues to manage focus, scrolling,
positioning, and selection.
