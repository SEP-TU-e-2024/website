# Returns a dict with the following:
# key: string -> fingerprint given by simian
# value: tuple(int, bool) -> number of duplicated lines, is the same file (true=internal, false=external)
def parse_output(file):
    duplications = dict()
    
    lines = file.readlines()
    for i in range(len(lines)):
        if "fingerprint" in lines[i]:
            line = lines[i].split()
            f1 = lines[i + 1].split()[-1]
            f2 = lines[i + 2].split()[-1]
            duplications[line[6]] = (int(line[1]), f1==f2)

    total_lines = int(lines[-2].split()[4])
    num_files = int(lines[-2].split()[-2])

    return duplications, total_lines, num_files

def compute_percentages_simian(duplications, total):
    percentages = {"Internal duplication":0, "External duplication":0}

    for num, t in duplications.values():
        if t:
            percentages["Internal duplication"] += num
        else:
            percentages["External duplication"] += num

    percentages["Internal duplication"] = percentages["Internal duplication"] / total
    percentages["External duplication"] = percentages["External duplication"] / total

    return percentages