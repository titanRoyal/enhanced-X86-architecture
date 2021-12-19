ascii hello="hello world: "
mov [!hello],DATA
## writing interuption
int 0x0
mov 0x99,r1
hlt