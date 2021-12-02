start:
mov &[((0x1+0x1)-0x1)*0x3],r2
cal &[!first]
inc r1
hlt

first:
add r1,r2
ret