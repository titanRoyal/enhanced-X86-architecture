ascii hello="hello world"


mov [!hello],DATA
int 0x0
inc IM
int 0x0
hlt