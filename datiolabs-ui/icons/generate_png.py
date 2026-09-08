import zlib
import struct

def make_png(width, height, pixels):
    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)

    raw = bytearray()
    for y in range(height):
        raw.append(0) # filter type none
        for x in range(width):
            r, g, b, a = pixels[y][x]
            raw.extend([r, g, b, a])

    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    idat = zlib.compress(bytes(raw))

    png = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', idat) + chunk(b'IEND', b'')
    return png

from generate_icons import create_d_image

pixels = create_d_image(256, 256)
png_data = make_png(256, 256, pixels)
with open('/home/ec2-user/apex/datiolabs-ui/icons/icon.png', 'wb') as f:
    f.write(png_data)
print("icon.png 256x256 generado con D.")
